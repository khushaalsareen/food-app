import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from "stripe";
import { User } from "../models/user.model";
import { Menu } from "../models/menu.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutSessionRequest = {
    cartItems: {
        menuId: string;
        name: string;
        image: string;
        price: number;
        quantity: number
    }[],
    deliveryDetails: {
        name: string;
        email: string;
        address: string;
        city: string
    },
    restaurantId: string
}

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.id, status: { $ne: "cart" } }).populate('user').populate('restaurant');
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const addToCart = async (req: Request, res: Response) => {
    try {
        const { userId, restaurantId, menuId, quantity } = req.body;

        if (!userId || !restaurantId || !menuId || !quantity) {
            return res.status(400).json({ success: false, message: "Invalid request" });
        }
        // find the restaurant
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const menu = await Menu.findById(menuId);
        if (!menu) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }

        // check if the user already has a cart for this restaurant
        const existingOrder = await Order.findOne({ user: userId, restaurant: restaurantId, status: "cart" });
        if (existingOrder) {
            // if the order exists, update the cart items
            const existingCartItem = Array.isArray(existingOrder.cartItems)
                ? existingOrder.cartItems.find((item: any) => item.menuId.toString() === menuId)
                : undefined;
            if (existingCartItem) {
                // if the item already exists in the cart, update the quantity
                existingCartItem.quantity += quantity;
            } else {
                existingOrder.cartItems.push({
                    menuId: menu._id as string,
                    name: menu.name,
                    image: menu.image,
                    price: menu.price,
                    quantity
                });
            }
            await existingOrder.save();
        } else {
            // if no order exists, create a new one
            const newOrder = new Order({
                user: userId,
                restaurant: restaurantId,
                cartItems: [{
                    menuId: menu._id,
                    name: menu.name,
                    image: menu.image,
                    price: menu.price,
                    quantity
                }],
                status: "cart"
            });
            await newOrder.save();
        }
        return res.status(200).json({ success: true, message: "Item added to cart successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })

    }
}

export const removeItemFromCart = async (req: Request, res: Response) => {
    try {
        const { userId, restaurantId, menuId, quantity } = req.body;

        if (!userId || !restaurantId || !menuId) {
            return res.status(400).json({ success: false, message: "Invalid request" });
        }

        // find the order for the user and restaurant
        const order = await Order.findOne({ user: userId, restaurant: restaurantId, status: "cart" });
        if (!order) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        if (!quantity || quantity <= 0) {
            // remove the item from the cart
            order.cartItems = order.cartItems.filter((item: any) => item.menuId.toString() !== menuId);
            await order.save();

            return res.status(200).json({ success: true, message: "Item removed from cart successfully" });
        }
        else {
            // make cartItem quantity as quantity 
            const cartItem = order.cartItems.find((item: any) => item.menuId.toString() === menuId);
            if (!cartItem) {
                return res.status(404).json({ success: false, message: "Item not found in cart" });
            }
            if (cartItem.quantity < quantity) {
                return res.status(400).json({ success: false, message: "Quantity exceeds available stock" });
            }
            cartItem.quantity = quantity;
            await order.save();
            return res.status(200).json({ success: true, message: "Item quantity updated successfully" });

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })

    }
}

export const clearCart = async (req: Request, res: Response) => {
    try {
        const { userId, restaurantId } = req.body;

        if (!userId || !restaurantId) {
            return res.status(400).json({ success: false, message: "Invalid request" });
        }

        // find the order for the user and restaurant
        const order = await Order.findOne({ user: userId, restaurant: restaurantId, status: "cart" });
        if (!order) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        // clear the cart items
        order.cartItems = [];
        await order.save();

        return res.status(200).json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })

    }
}

export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = req.id;

        // Only get items with status "cart"
        const carts = await Order.find({
            user: userId,
            status: "cart"  // Add this filter
        })
            .populate({
                path: 'restaurant',
                select: 'restaurantName'
            });

        if (!carts || carts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Flatten cart items and add restaurant info
        // const flattenedCart = carts.flatMap(cart =>
        //     cart.cartItems.map(item => ({
        //         _id: item._id,
        //         name: item.name,
        //         description: item.description || "",
        //         price: item.price,
        //         image: item.image,
        //         restaurant: cart.restaurant._id,
        //         quantity: item.quantity,
        //         restName: cart.restaurant.restaurantName
        //     }))
        // );

        return res.status(200).json({
            success: true,
            cart: carts.map(cart => ({
                _id: cart._id,
                restaurantId: (cart.restaurant as any)?._id,
                restaurantName: (cart.restaurant as any)?.restaurantName || "Unknown Restaurant",
                cartItems: cart.cartItems.map(item => ({
                    menuId: item.menuId,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity
                })),
                deliveryDetails: cart.deliveryDetails || {},
                status: cart.status
            }))
        });

    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;
        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found."
            })
        };

        //  get order restaurant and user
        const order = await Order.findOne({
            restaurant: checkoutSessionRequest.restaurantId,
            user: req.id,
            status: "cart"
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            })
        }

        // line items
        const menuItems = restaurant.menus;
        const lineItems = createLineItems(checkoutSessionRequest, menuItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB', 'US', 'CA']
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/status`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                images: JSON.stringify(menuItems.map((item: any) => item.image))
            }
        });
        if (!session.url) {
            return res.status(400).json({ success: false, message: "Error while creating session" });
        }
        // Update order with session details
        order.status = "pending";
        order.totalAmount = session.amount_total ? session.amount_total / 100 : 0;

        order.deliveryDetails = checkoutSessionRequest.deliveryDetails;

        await order.save();
        return res.status(200).json({
            session
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })

    }
}

export const stripeWebhook = async (req: Request, res: Response) => {
    let event;

    try {
        const signature = req.headers["stripe-signature"];

        // Construct the payload string for verification
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

        // Generate test header string for event construction
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });

        // Construct the event using the payload string and header
        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error: any) {
        console.error('Webhook error:', error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // // Handle the checkout session completed event
    // if (event.type === "checkout.session.completed") {
    //     try {
    //         console.log("Handling checkout.session.completed event");
    //         const session = event.data.object as Stripe.Checkout.Session;
    //         const order = await Order.findById(session.metadata?.orderId);
    //         console.log("Order ID:", session.metadata);
    //         console.log("Session Amount Total:", session);
    //         if (!order) {
    //             return res.status(404).json({ message: "Order not found" });
    //         }

    //         // Update the order with the amount and status
    //         if (session.amount_total) {
    //             order.totalAmount = session.amount_total / 100;
    //         }
    //         order.status = "paymentdone";

    //         await order.save();
    //     } catch (error) {
    //         console.error('Error handling event:', error);
    //         return res.status(500).json({ message: "Internal Server Error" });
    //     }
    // }
    console.log(`Received event: ${event.type}`);
    switch (event.type) {
        case "checkout.session.completed":
            try {
                console.log("✅ Handling checkout.session.completed event");
                const session = event.data.object as Stripe.Checkout.Session;
                const order = await Order.findById(session.metadata?.orderId);

                if (!order) {
                    return res.status(404).json({ message: "Order not found" });
                }

                if (session.amount_total) {
                    order.totalAmount = session.amount_total / 100;
                }

                order.status = "paymentdone";
                await order.save();
            } catch (error) {
                console.error('Error handling success event:', error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
            break;

        case "checkout.session.async_payment_failed":
        case "payment_intent.payment_failed":
            try {
                console.log("Handling payment failure event");
                const session = event.data.object as Stripe.Checkout.Session;
                const orderId = session.metadata?.orderId;
                const order = await Order.findById(orderId);

                if (!order) {
                    return res.status(404).json({ message: "Order not found" });
                }

                order.status = "paymentfailed";
                await order.save();
            } catch (error) {
                console.error('Error handling failure event:', error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    // Send a 200 response to acknowledge receipt of the event
    res.status(200).send();
};

export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
    // 1. create line items
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId);
        if (!menuItem) throw new Error(`Menu item id not found`);

        console.log(menuItem);
        if (cartItem.quantity < menuItem.quantity) {
            throw new Error(`Insufficient quantity for ${menuItem.name}. Available: ${menuItem.quantity}, Requested: ${cartItem.quantity}`);
        }
        // menuItem.quantity = cartItem.quantity; // Decrease the quantity in the menu item
        menuItem.save(); // Save the updated menu item
        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100
            },
            quantity: cartItem.quantity,
        }
    })
    // 2. return lineItems
    return lineItems;
}
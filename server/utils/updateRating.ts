import { Menu, MenuRating } from "../models/menu.model";
import { Restaurant, RestaurantRating } from "../models/restaurant.model";

export const updateRating = async () => {

    try {
        const restaurants = await Restaurant.find();
        for (const restaurant of restaurants) {
            const ratings = await RestaurantRating.find({ restaurant: restaurant._id });
            if (ratings.length > 0) {
                const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
                restaurant.rating = totalRating / ratings.length;
                restaurant.noOfRatings = ratings.length;
            } else {
                restaurant.rating = 0;
                restaurant.noOfRatings = 0;
            }
        }
        await Restaurant.bulkSave(restaurants);
    }
    catch (error) {
        console.error("Error updating restaurant ratings:", error);
    }

    try {
        const menus = await Menu.find();
        for (const menu of menus) {
            const ratings = await MenuRating.find({ menu: menu._id });
            if (ratings.length > 0) {
                const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
                menu.rating = totalRating / ratings.length;
                menu.noOfRatings = ratings.length;
            } else {
                menu.rating = 0;
                menu.noOfRatings = 0;
            }
        }
        await Menu.bulkSave(menus);
    }
    catch (error) {
        console.error("Error updating menu ratings:", error);
    }
}

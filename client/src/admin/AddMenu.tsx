import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";

const AddMenu = () => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
    quantity: "1",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [error, setError] = useState<Partial<MenuFormSchema>>({});

  const { loading, createMenu } = useMenuStore();
  const { singleRestaurant, getSingleRestaurant } = useRestaurantStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      formData.append("quantity", input.quantity.toString());

      if (input.image) {
        formData.append("image", input.image);
      }

      await createMenu(formData);

      if (restaurant?._id) {
        await getSingleRestaurant(restaurant._id);
      }

      setInput({
        name: "",
        description: "",
        price: 0,
        image: undefined,
        quantity: "1",
      });
      setOpen(false);
      setError({});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleRestaurant(restaurant._id);
  }, []);

  console.log(restaurant);
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Available Menus</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange hover:bg-hoverOrange">
              <Plus className="mr-2 h-4 w-4" />
              Add Menu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add A New Menu</DialogTitle>
              <DialogDescription>
                Create a menu that will make your restaurant stand out.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-4">
              {[
                {
                  label: "Name",
                  name: "name",
                  type: "text",
                  placeholder: "Enter menu name",
                },
                {
                  label: "Description",
                  name: "description",
                  type: "text",
                  placeholder: "Enter menu description",
                },
                {
                  label: "Price (in ₹)",
                  name: "price",
                  type: "number",
                  placeholder: "Enter menu price",
                },
                {
                  label: "Quantity",
                  name: "quantity",
                  type: "text",
                  placeholder: "Enter availability quantity",
                },
              ].map((field) => (
                <div key={field.name}>
                  <Label>{field.label}</Label>
                  <Input
                    type={field.type}
                    name={field.name}
                    value={
                      input[field.name as keyof typeof input] as string | number
                    }
                    onChange={changeEventHandler}
                    placeholder={field.placeholder}
                  />
                  {error[field.name as keyof typeof error] && (
                    <span className="text-xs font-medium text-red-600">
                      {error[field.name as keyof typeof error]}
                    </span>
                  )}
                </div>
              ))}

              <div>
                <Label>Upload Menu Image</Label>
                <Input
                  type="file"
                  name="image"
                  onChange={(e) =>
                    setInput({
                      ...input,
                      image: e.target.files?.[0] || undefined,
                    })
                  }
                />
                {error.image?.name && (
                  <span className="text-xs font-medium text-red-600">
                    {error.image?.name}
                  </span>
                )}
              </div>

              <DialogFooter className="mt-5">
                <Button
                  type="submit"
                  className="bg-orange hover:bg-hoverOrange"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {singleRestaurant?.menus?.map((menu: any, idx: number) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-900"
          >
            <img
              src={menu.image}
              alt={menu.name}
              className="h-24 w-24 object-cover rounded-md"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {menu.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {menu.description}
              </p>
              <p className="text-md font-medium text-[#D19254] mt-2">
                ₹ {menu.price}
              </p>
            </div>
            <Button
              size="sm"
              className="bg-orange hover:bg-hoverOrange"
              onClick={() => {
                setSelectedMenu(menu);
                setEditOpen(true);
              }}
            >
              Edit
            </Button>
          </div>
        ))}
      </div>

      <EditMenu
        selectedMenu={selectedMenu}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
      />
    </div>
  );
};

export default AddMenu;

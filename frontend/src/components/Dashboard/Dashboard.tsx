import { useGetDishCategoriesQuery } from "@apis/dishAPI";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@stores/zustandStore";
import { groupCategories } from "@utils/groupCategories";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

const sidebarButtonClass =
  "mb-2 h-auto w-full justify-start overflow-hidden truncate rounded-md bg-transparent px-3 py-2 font-sans text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

const Dashboard = () => {
  const { t } = useTranslation();
  const { setDishCategory, dishCategory } = useAppStore();

  const { data: dishCategories } = useGetDishCategoriesQuery();
  const dishCategoriesData = dishCategories?.data || [];
  const groupedCategories = groupCategories(dishCategoriesData);

  const [expanded, setExpanded] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubCategoryClick = (subcategory: {
    id: string;
    name: string;
  }) => {
    if (subcategory.id !== dishCategory?.id) {
      setDishCategory(subcategory);
    }
  };

  const handleCategoryClick = (category: { id: string; name: string }) => {
    if (category.id !== dishCategory?.id) {
      console.log("category", category);
      setDishCategory(category);
    }
  };

  return (
    <div className='relative flex h-screen pt-[55px]'>
      <aside
        className={cn(
          "relative overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out",
          isCollapsed ? "w-[60px] p-2.5 pt-5" : "w-[250px] p-5"
        )}
      >
        <Button
          type='button'
          onClick={() => setIsCollapsed((prev) => !prev)}
          className={cn(
            "z-[1300] mb-3 h-10 bg-primary text-primary-foreground transition-all duration-[120ms] ease-in-out hover:bg-primary-hover",
            isCollapsed ? "w-10 rounded-full px-0" : "w-full rounded-lg"
          )}
        >
          !!!
        </Button>

        {!isCollapsed &&
          Object.keys(groupedCategories).map((mainCategory) => {
            const { id, subCategories } = groupedCategories[mainCategory];
            const hasSubCategories = subCategories.length > 0;

            if (!hasSubCategories) {
              return (
                <Button
                  key={mainCategory}
                  type='button'
                  variant='ghost'
                  onClick={() =>
                    handleCategoryClick({
                      id,
                      name: mainCategory,
                    })
                  }
                  className={sidebarButtonClass}
                >
                  {t(`categories.${mainCategory}`, mainCategory)}
                </Button>
              );
            }

            return (
              <Accordion
                key={mainCategory}
                type='single'
                collapsible
                value={expanded === mainCategory ? mainCategory : ""}
                onValueChange={(value) => setExpanded(value)}
                className='mb-3 overflow-hidden rounded-lg'
              >
                <AccordionItem value={mainCategory} className='border-none'>
                  <AccordionTrigger
                    className={cn(
                      "rounded-md bg-sidebar px-3 py-2.5 font-sans text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent hover:no-underline data-[state=open]:rounded-b-none data-[state=open]:bg-sidebar-primary data-[state=open]:text-sidebar-primary-foreground data-[state=open]:hover:bg-sidebar-primary"
                    )}
                  >
                    {t(`categories.${mainCategory}`, mainCategory)}
                  </AccordionTrigger>
                  <AccordionContent className='bg-sidebar px-4 py-2 pb-2'>
                    {subCategories.map((subcategory) => (
                      <Button
                        key={subcategory.id}
                        type='button'
                        variant='ghost'
                        onClick={() =>
                          handleSubCategoryClick({
                            id: subcategory.id,
                            name: t(
                              `categories.${mainCategory}-${subcategory.name}`,
                              subcategory.name
                            ),
                          })
                        }
                        className={sidebarButtonClass}
                      >
                        {t(
                          `categories.${mainCategory}-${subcategory.name}`,
                          subcategory.name
                        )}
                      </Button>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
      </aside>
      <main className='flex-1 overflow-y-auto p-4'>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;

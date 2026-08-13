import { useGetDishByIdQuery } from "@apis/dishAPI";
// import { DishContent } from "@components/index";
import { AnimationWrap, NoFoundData } from "@shared/index";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const DishPage = () => {
  const { t } = useTranslation();

  const { dishId } = useParams<{ dishId: string }>();
  const { data, error } = useGetDishByIdQuery(
    { dishId: dishId || "" },
    {
      skip: !dishId,
      refetchOnMountOrArgChange: true,
    }
  );

  const getErrorMessage = () => {
    if (error && "status" in error) {
      if (error.status === 500) {
        return t("error.serverError");
      }
      return t("dish.noDishesFound");
    }
    return t("error.unknownError");
  };

  return (
    <AnimationWrap>
      <h1>DishPage</h1>
      {/* {error ? (
        <NoFoundData text={getErrorMessage()} />
      ) : data ? (
        <DishContent selectedDish={data} />
      ) : null} */}
    </AnimationWrap>
  );
};

export default DishPage;

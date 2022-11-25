import React, {FC} from "react";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./ingredient-item.module.css";
import { useSelector, useDispatch } from "react-redux";
import { MODAL_OPEN } from "../../services/actions/modal";
import { useDrag } from "react-dnd";
import {useHistory, useLocation} from "react-router-dom";
import {IIngredient} from "../../utils/types";

interface IComponentProps {
  id: string;
}

const IngredientItem: FC<IComponentProps> = ({ id}) => {
  const history = useHistory()
  const location = useLocation()
  // @ts-ignore
  const { ingredientsArray } = useSelector((store) => store.ingredients);
  const { constructorBun, constructorIng } = useSelector(
      // @ts-ignore
    (store) => store.constructorList
  );

  const element = ingredientsArray.find((el: IIngredient) => el._id === id && el);

  const counter = React.useMemo(() => {
    let count = 0;

    if (element.type !== "bun") {
      constructorIng.map((e: IIngredient) => {
        if (e._id === element._id) {
          ++count;
        }
      });
    } else {
      constructorBun.map((e: IIngredient) => {
        if (e._id === element._id) {
          return count = 2;
        }
      });
    }
    return count;
  }, [constructorIng, constructorBun]);

  const dispatch = useDispatch();

  const [{ isDrag }, dragRef] = useDrag({
    type: "ingredient",
    item: element,
    collect: (monitor) => ({
      isDrag: monitor.isDragging(),
    }),
  });

  const modal = () => {
    history.push(`ingredients/${id}`, {background: location})
    dispatch({
      type: MODAL_OPEN,
    });
  };

  return (
    <div className={styles.block} onClick={modal} ref={dragRef}>
      {counter !== 0 && (
        <Counter count={counter} size="default" />
      )}
      <img alt={element.name} src={element.image} className={styles.img} />
      <div className={styles.price}>
        <p className="text text_type_digits-default pr-2">{element.price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <div className={styles.name}>
        <p className="mt-3 text text_type_main-default">{element.name}</p>
      </div>
    </div>
  );
};

export default IngredientItem;

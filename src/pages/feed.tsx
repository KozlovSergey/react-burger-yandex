import React, { FC, useEffect } from "react";
import styles from "./style.module.css";
import { OrderCard } from "../components/order-card/order-card";
import { useDispatchHook, useSelectorHook } from "../hooks/redux";
import { connectWsFeed, disconnectWsFeed } from "../services/actions/ws-feed";

export const Feed: FC = () => {
  const dispatch = useDispatchHook();
  const { data } = useSelectorHook((store) => store.feed);

  useEffect(() => {
    connectWsFeed(dispatch);

    return () => {
      disconnectWsFeed(dispatch);
    };
  }, [dispatch]);

  const doneOrders = data.orders.map((el) =>
    el.status === "done" ? (
      <li
        key={el._id}
        className="text text_type_digits-default text_color_success"
      >
        {el.number}
      </li>
    ) : null
  );

  const pendingOrders = data.orders.map((el) =>
    el.status === "pending" ? (
      <li key={el._id} className="text text_type_digits-default">
        {el.number}
      </li>
    ) : null
  );

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.warp}>
          <h1 className="text text_type_main-large mt-10 mb-5">
            Лента заказов
          </h1>
          <div className={styles.main_left}>
            <div className={styles.scroll}>
              {data.orders.map((el) => (
                <OrderCard key={el._id} item={el} />
              ))}
            </div>
          </div>
        </div>
        <div className="mr-15" />
        <div className={styles.warp}>
          <div className={styles.main_right}>
            <div className={styles.order_state}>
              <div className={styles.order_numbers}>
                <h2 className="text text_type_main-medium mb-6">Готовы:</h2>
                <ul className={styles.order_list}>
                  {doneOrders}
                </ul>
              </div>
              <div className={styles.order_numbers}>
                <h2 className="text text_type_main-medium mb-6">В работе:</h2>
                <ul className={styles.order_list}>
                  {pendingOrders}
                </ul>
              </div>
            </div>
            <div>
              <h2 className="text text_type_main-medium mb-6">
                Выполнено за все время:
              </h2>
              <p className={styles.order_bignumber}>{data.total}</p>
            </div>
            <div>
              <h2 className="text text_type_main-medium mb-6">
                Выполнено за сегодня:
              </h2>
              <p className={styles.order_bignumber}>{data.totalToday}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

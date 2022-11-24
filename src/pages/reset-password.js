import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import {
  Input,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, refreshToken } from "../services/actions/user";
import {Link, Redirect, useHistory} from "react-router-dom";
import Loader from "../components/loader/loader";
import {resetPassword} from "../services/actions/reset-password";

export const ResetPassword = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState(false);
  const [form, setForm] = useState({ token: "", password: ""});
  const inputRef = React.useRef(null);
  const { jwtExpired, jwtInvalid, userRequest, userSuccess, userFailed } =
    useSelector((store) => store.user);
  const { sendSuccess, resetSuccess } = useSelector(store => store.reset)

  useEffect(() => {
    if (!jwtInvalid) {
      dispatch(getUserData());
    }
    if (jwtExpired) {
      dispatch(refreshToken());
    }
    if (resetSuccess) {
      setRedirect(true);
    }
  }, [dispatch, jwtExpired, jwtInvalid, resetSuccess]);


  if (history.length === 1 || !sendSuccess) {
      return <Redirect to="/forgot-password"/>
  }

  if (userSuccess) {
    return <Redirect to="/profile" />;
  }

  if (redirect) {
    return <Redirect to="/login" />;
  }

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onIconClick = () => {
    setTimeout(() => inputRef.current.focus(), 0);
    alert("Icon Click Callback");
  };

  const changePassword = (e) => {
    e.preventDefault()
    dispatch(resetPassword(form))
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {userRequest && !userFailed && (
          <div className={styles.info}>
            <Loader />
          </div>
        )}
        {userFailed && (
          <form className={styles.form} onSubmit={changePassword}>
            <p className="text text_type_main-medium">Восстановление пароля</p>
            <div className={"mb-6"} />
            <Input
                type={"text"}
                placeholder={"Введите новый пароль"}
                onChange={onChange}
                value={form.password}
                icon={"ShowIcon"}
                name={"password"}
                ref={inputRef}
                onIconClick={onIconClick}
                error={false}
                errorText={"Ошибка"}
                size={"default"}
            />
            <div className={"mb-6"} />
            <Input
              type={"text"}
              placeholder={"Введите код из письма"}
              onChange={onChange}
              value={form.token}
              name={"token"}
              ref={inputRef}
              onIconClick={onIconClick}
              error={false}
              errorText={"Ошибка"}
              size={"default"}
            />
            <div className={"mb-6"} />
            <Button type="primary" size="large">
              Сохранить
            </Button>
            <div className={"mb-20"} />
            <p className={"text text_color_inactive text_type_main-default"}>
              Вспомнили пароль?
              <Link to="/login">
                <button className={styles.button}>Войти</button>
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
};
import React, { FC, useContext, useState } from 'react';
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import SignInForm from './SingInForm';
import '../scss/LoginForm.scss';
import promoImg from "../image/promo.svg";


const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { store } = useContext(Context);

  return (
    <div className="container">
      <section className="form">
        <div className="form-content">
          <h1 className="form-title">Sign in</h1>
          <p className="form-subtitle">
            If you don’t have an account register, you can fill in the fields below and click the
            register button
          </p>
          <SignInForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onLogin={() => store.login(email, password)}
            onRegister={() => store.registration(email, password)}
          />
        </div>
      </section>
      <section className="promo">
        <div className="promo-box">
          <div className="promo__content">
            <img src={promoImg} alt="promo" className="promo__image" />
          </div>
          <h2 className="promo__title">Welcome to this page!</h2>
        </div>
      </section>
    </div>
  );
};

export default observer(LoginForm);
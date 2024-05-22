import React, { FC, useContext, useEffect, useState } from 'react';
import LoginForm from "./components/LoginForm";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import { IUser } from "./models/IUser";
import UserService from "./service/UserService";
import '../src/scss/App.scss';
import homeImg from "../src/image/home.jpg";

const App: FC = () => {
    const { store } = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);
    const [showUsers, setShowUsers] = useState(false);
    const isAdmin = store.user.role === 'admin';
    const isManager = store.user.role === 'manager';

    //   useEffect(() => {
    //     console.log(store.user)
    //       if (localStorage.getItem('token')) {
    //         //   store.checkAuth()
    //       }
    //   }, [store])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    const toggleUsersVisibility = () => {
        setShowUsers((prevShowUsers) => !prevShowUsers);
        // Якщо користувачі не відображені, отримати їх
        if (!showUsers) {
            getUsers();
        }
    };

    if (store.isLoading) {
        return <div>Завантаження...</div>
    }

    if (!localStorage.getItem('token')) {
        return (
            <div>
                <LoginForm />
            </div>
        );
    }

    const updateUser = async (id: string, email: string) => {
        try {
            const res = await UserService.updateUser(id, email)
            console.log(res)
        } catch (error: any) {
            console.log(error?.response?.data?.message)
        }

    }

    const renderEmailLine = (index: number) => {
        if (isAdmin || isManager) {
            return <input className='input-email'
                onChange={(e: any) => setUsers((prevArr) => {
                    const result = [...prevArr];
                    result[index].email = e.target.value;
                    return result;
                })}
                value={users[index].email} />
        }

        return <span>{users[index].email}</span>
    }

    const renderRoles = (roles: string[] | undefined) => {
        if (!roles || roles.length === 0) {
            return 'Немає ролей';
        }
    
        return roles.map((role, index) => (
            <span key={index}>{role}{index < roles.length - 1 ? ', ' : ''}</span>
        ));
    };
    
    const renderUserInfo = (user: IUser, index: number) => {
        return (
            <div>
                <p>Email: {renderEmailLine(index)}</p>
                <p>Дата реєстрації: {new Date(user.registrationDate).toLocaleString()}</p>
                <p>Остання дата входу: {user.lastLoginDate ? new Date(user.lastLoginDate).toLocaleString() : 'N/A'}</p>
            </div>
        );
    };


    const deleteuser = async (id: string) => {
        try {
            await UserService.deleteUser(id)
            setUsers((prev) => prev.filter((item) => item._id !== id))
        } catch (error: any) {
            console.log(error?.response?.data?.message)
        }
    }

    return (
        <div className="app-container">
            <div className="left-block">
                <img src={homeImg} alt="home" className="home__image" />
            </div>
            <div className="right-block">
                <div className="message-box">
                    <h2 className='message-box__title'>{store.isAuth ? `Користувач ${store.user.email} авторизован` : 'Авторизуйтесь'}</h2>
                </div>
                <div>
                <button onClick={() => store.logout()} className='btn-exit'>Вийти</button>
                    <button onClick={toggleUsersVisibility} className='btn-get'>
                        {showUsers ? 'Приховати користувачів' : 'Отримати користувачів'}
                    </button>
                </div>
                {showUsers && (
                    <div>
                        {users.map((user, index) => {
                            return (
                                <div key={index} className='box-users'>
                                    {renderUserInfo(user, index)}
                                    {(isAdmin || isManager) && <button onClick={() => updateUser(user._id, users[index].email)} className='btn-update'>змінити</button>}
                                    {isAdmin && <button onClick={() => deleteuser(user._id)} className='btn-delete'>видалити</button>}
                                </div>
                            )
                        })}
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default observer(App);

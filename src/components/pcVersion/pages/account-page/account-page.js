import React, {useContext, useEffect, useState} from "react";
import './account-page.scss'
import {AuthContext} from "../../../../context/AuthContext";
import {useMessage} from "../../../../hooks/message.hook";
import {useHttp} from "../../../../hooks/http.hook";
import Modal from 'react-modal';
import close from '../../../../img/close.png';

export const AccountPage = () => {

    const userData = JSON.parse(window.localStorage.getItem('userData'));

    const authToken = useContext(AuthContext);
    const message = useMessage();
    const {request} = useHttp();
    const [data, setData] = useState([]);
    const [orders, setOrders] = useState([])
    const [name, setName] = useState([]);
    const [selected, setSelected] = useState('');
    const [orderIsOpen, setOrderIsOpen] = useState(false)
    const [currentOrder, setCurrentOrder] = useState([])

    // console.log(authToken)

    const changeHandler = event => {
        setData(({...data, [event.target.name]: event.target.value}))
    }

    // Получить данные профиля и заказов профиля

    useEffect(() => {
        async function fetchData() {
            const personal = await request(`/api/personal/?is_star=${userData.is_star}&user_id=${userData.userId}`, 'GET', null, {Authorization: `Bearer ${userData.token}`})
            setData(personal)

            // console.log(personal)
            // console.log(orders)
            // setName(orders.data.customer)
            // console.log('hello1')
        }

        async function fetchOrders() {
            const orders = await request(`/api/order/list/?is_star=${userData.is_star}&user_id=${userData.userId}`, 'GET', null, {Authorization: `Bearer ${userData.token}`})
            setOrders([...orders.orders])
            setName(orders.data.customer)
        }

        // console.log('hello2')
        fetchData();
        fetchOrders();
    }, [authToken.isStar, authToken.id, authToken.token, request])

    // Изменение персональных данных

    const submitHandler = async () => {

        try {
            const dataLog = await request('/api/personal/', 'PUT', {
                ...data,
                id: authToken.id
            }, {Authorization: `Bearer ${authToken.token}`})
            if (dataLog === 201) {
                message('Данные успешно изменены');
            }
        } catch (e) {
            message(e);

            // console.log(e);
        }
    }

    const hashTagLink = '#';

    // Запросить смену пароля

    const makeRequest = async () => {
        try {
            const changePW = await request('/password-reset/', 'POST', {"email": authToken.email}, {Authorization: `Bearer ${authToken.token}`})
            message('Вам на почту отправлена ссылка для смены пароля');
        } catch (e) {
            message(e)
        }
    }

    // Обработка статуса заказа

    const parsedStatus = (status) => {
        switch (status) {
            case 0:
                return 'Новый';
            case 1:
                return 'Принят';
            case -1:
                return 'Отклонен';
            case 2:
                return 'Ожидание оплаты';
            case 3:
                return 'Оплачено';
            default:
                return '';
        }
    }
    const statusColor = (status) => {
        switch (status) {
            case 0:
                return '#e5e5e5';
            case 1:
                return '#e9d88b';
            case -1:
                return '#583232';
            case 2:
                return '#cdc4ec';
            case 3:
                return '#d2e8c2';
            default:
                return '';
        }
    }

    // Принять/отказать в заказе

    const rejectOrder = async (value) => {
        console.log(value)
        try {
            const changePW = await request(
                '/api/order/accept/',
                'POST',
                {order_id: value, accept: 'reject'},
                {Authorization: `Bearer ${authToken.token}`}
            )
            // setSelected(value)
        } catch (e) {
            message(e)
        }
        message(['Заказ отклонен'])
    }

    const acceptOrder = async (value) => {
        console.log(value)
        try {
            const changePW = await request(
                '/api/order/accept/',
                'POST',
                {order_id: value, accept: 'accept'},
                {Authorization: `Bearer ${authToken.token}`}
            )
            // setSelected(value)
        } catch (e) {
            message(e)
        }
        message('Заказ принят')
    }

    //  Стили и методы модального окна

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            height: 'auto',
            width: '65%',
            borderRadius: '25px',
            padding: '50px 60px',
            backgroundColor: `white`,
        }
    };

    const showModal = (value) => {
        console.log(value)
        setCurrentOrder(value);
        setOrderIsOpen(true)
    }
    const closeModal = () => {
        setOrderIsOpen(false)
    }

    Modal.setAppElement(document.querySelector('.App'))


    // console.log(orders)

    return (
        <section className="account-page">
            <div className="container account-page__my-data">
                <h3>Мои данные</h3>
                <ul className="list-group">
                    <li className="list-group-item">
                        <div className="list-item__title">
                            <span>Имя пользователя</span>
                        </div>
                        <div className="list-item_content">
                            <input type="text" name={'username'} className="form-control" onChange={changeHandler} value={data.username}/>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="list-item__title">
                            <span>Телефон</span>
                        </div>
                        <div className="list-item_content">
                            <input type="text" name={'phone'} className="form-control" onChange={changeHandler} value={data.phone}/>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="list-item__title">
                            <span>Email</span>
                        </div>
                        <div className="list-item_content">
                            <input type="text" name={'email'} className="form-control" onChange={changeHandler} value={data.email}/>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="list-item__title">
                            <span>Дата рождения</span>
                        </div>
                        <div className="list-item_content">
                            <input type="text" name={'date_of_birth'} className="form-control" onChange={changeHandler} value={data.date_of_birth}/>
                        </div>
                    </li>
                </ul>
                <div className="btn-wrapper">
                    <button className="name-me" onClick={makeRequest}>Запросить изменение пароля</button>
                    <button className="name-me" onClick={submitHandler}>Сохранить изменения</button>
                </div>
            </div>
            <div className="container account-page__orders">
                <h3>История заявок</h3>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">От кого</th>
                        <th scope="col">Время</th>
                        <th scope="col">Дата</th>
                        <th scope="col">Статус</th>
                    </tr>
                    </thead>
                    {/*<tbody>*/}
                    {orders.map((value, key) => {

                        return (
                            <tbody key={key}>
                            <tr>
                                <th>{name}</th>
                                <td>{value.by_time}</td>
                                <td>{value.by_date}</td>
                                <td className="order-status-new"
                                    style={{color: statusColor(value.status_order)}}>{parsedStatus(value.status_order)}</td>
                            </tr>
                            <tr>
                                <th>
                                    <button className="btn btn-look" onClick={() => showModal(value)}>Посмотреть
                                    </button>
                                </th>
                                <td/>
                                <td/>
                                <td>
                                    <button
                                        className="btn btn-decline"
                                        onClick={() => rejectOrder(value.id)}
                                    >Отклонить
                                    </button>
                                </td>
                            </tr>
                            </tbody>

                        )
                    })}
                </table>
            </div>
            <Modal
                isOpen={orderIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                style={customStyles}
            >
                <div className="pc-modal-header">
                    <div className={'close-btn'} onClick={closeModal}>
                        <img src={close}
                             alt="Close"
                        />
                    </div>
                    <div className="header-text">
                        <span>Данные по заявке</span>
                    </div>
                </div>
                <div className="signInInputs spread">
                    <div className="name field">
                        <span className="field-name">
Имя
                        </span>
                        <span className="field-value">
                            {name}
                        </span>
                    </div>

                    <div className="time field">
                        <span className="field-name">
Время
                        </span>
                        <span className="field-value">
                            {currentOrder.by_time}
                        </span>
                    </div>

                    <div className="date field">
                        <span className="field-name">
Дата
                        </span>
                        <span className="field-value">
                            {currentOrder.by_date}
                        </span>
                    </div>

                    <div className="for-whom field">
                        <span className="field-name">
Кому
                        </span>
                        <span className="field-value">
                            {currentOrder.for_whom}
                        </span>
                    </div>

                    <div className="comment field">
                        <span className="field-name">
Комментарий к заказу
                        </span>
                        <span className="field-value">
                            {currentOrder.comment}
                        </span>
                    </div>

                    <div className="price field">
                        <span className="field-name">
Цена
                        </span>
                        <span className="field-value">
                            {currentOrder.order_price}
                        </span>
                    </div>
                    <div className="btn-wrapper">
                        <button className={'accept'} onClick={() => acceptOrder(currentOrder.id)}>
                            Принять
                        </button>
                        <button className={'decline'} onClick={() => rejectOrder(currentOrder.id)}>
                            Отклонить
                        </button>
                    </div>

                </div>
            </Modal>
        </section>
    )
}
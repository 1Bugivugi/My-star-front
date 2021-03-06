import React, {useContext, useState} from 'react';
import './order.scss';
import marker from '../../../img/order_icons/chosenOne.svg';
import {AuthContext} from "../../../context/AuthContext";
// import {useHistory} from 'react-router-dom';
// import {StarsContext} from "../../../context/StarsContext";
// import {useHttp} from "../../../hooks/http.hook";
// import {useMessage} from "../../../hooks/message.hook";
// import {AuthContext} from "../../../context/AuthContext";

export const SingleOrder = ({getId, watchOrder, turnOnDetail, bgColor, date, time, comment, forWhom, price, status, name, key, id}) => {

    const authToken = useContext(AuthContext);

    const [selected, setSelected] = useState(false)

    const orderDetails = {date: date, time: time, comment: comment, forWhom: forWhom, price: price, name: name}

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
                return '#f7b9b9';
            case 2:
                return '#cdc4ec';
            case 3:
                return '#d2e8c2';
            default:
                return '';
        }
    }

    function multipleHandler(value) {
        turnOnDetail(value)
        watchOrder(orderDetails)
    }

    function multipleHandler2() {
        getId(id);
        setSelected(!selected)
    }

    function multipleHandler3() {
        setSelected(!selected)
    }


    if (authToken.isStar) {
        if (selected) {
            return (
                <>
                    <div className={'order-card'} style={{backgroundImage: bgColor}} onClick={() => multipleHandler3()}>
                        <div className="status">
                            <span>Статус: </span>
                            <span className={'stage'}
                                  style={{backgroundColor: statusColor(status)}}>{parsedStatus(status)}</span>
                        </div>
                        <div className="main-info">
                            <div className="wrapper">
                                <span>Заказчик: <span style={{fontWeight: 700}}>{name}</span></span>
                                <span>Дата: <span style={{fontWeight: 700}}>{date}</span></span>
                            </div>
                            <button onClick={() => multipleHandler(true)}>Перейти к заказу</button>
                        </div>
                    </div>
                    <div className="order-card__overlay">
                        <img src={marker} alt="Tick"/>
                    </div>
                </>
            )
        }
        return (
            <>
                <div className={'order-card'} style={{backgroundImage: bgColor}} onClick={() => multipleHandler2()}>
                    <div className="status">
                        <span>Статус: </span>
                        <span className={'stage'}
                              style={{backgroundColor: statusColor(status)}}>{parsedStatus(status)}</span>
                    </div>
                    <div className="main-info">
                        <div className="wrapper">
                            <span>Заказчик: <span style={{fontWeight: 700}}>{name}</span></span>
                            <span>Дата: <span style={{fontWeight: 700}}>{date}</span></span>
                        </div>
                        <button onClick={() => multipleHandler(true)}>Перейти к заказу</button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className={'order-card'} style={{backgroundImage: bgColor}} onClick={() => multipleHandler3()}>
                <div className="status">
                    <span>Статус: </span>
                    <span className={'stage'}
                          style={{backgroundColor: statusColor(status)}}>{parsedStatus(status)}</span>
                </div>
                <div className="main-info">
                    <div className="wrapper">
                        <span>Заказчик: <span style={{fontWeight: 700}}>{name}</span></span>
                        <span>Дата: <span style={{fontWeight: 700}}>{date}</span></span>
                    </div>
                    <button onClick={() => multipleHandler(true)}>Перейти к заказу</button>
                </div>
            </div>
        </>
    )
}
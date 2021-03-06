import React, {useEffect, useState} from 'react';
import './filter-head.scss';
import {useHttp} from "../../../../hooks/http.hook";
import {useMessage} from "../../../../hooks/message.hook";

export const FilterHead = () => {

    const userData = JSON.parse(window.localStorage.getItem('userData'));

    const {request} = useHttp()
    const [data, setData] = useState([]);
    const [stars, setStars] = useState([]);
    const message = useMessage();
    const [starsList, setStarsList] = useState();

    // Fetch cats and all stars

    useEffect(() => {
        async function fetchData() {
            const cats = await request('/api/categories/', 'GET', null, {Authorization: `Bearer ${userData.token}`}) //'cors' ,
            if (!!cats.length) {
                setData([...cats])
            }
            const stars = await request('/api/star/getlist/', 'GET', null, {Authorization: `Bearer ${userData.token}`})
            if (!!stars.length) {
                setStars([...stars])
            }
        }
        fetchData();
    }, [userData.token, request])

    // console.log(data)

    // Cat click handler

    const clickHandler = async (value) => {
        try {
            const starsFetch = await request(`/api/star/category/?id=${value}`, 'GET', null, {Authorization: `Bearer ${userData.token}`}); //'cors' ,
            setStarsList([...starsFetch])
            // history.push(`/categories/stars`)

        } catch (e) {
            message(['В данной категории нет звезд']);
        }
    }

    console.log(starsList)

    return (
        <div className="filter-head">
            <div className="cats">
                <a href={'/'}>
                    <div className="cat">Главная</div>
                </a>
                {data.map((value, key) => {
                    return (
                        <div className="cat" key={key} onClick={() => clickHandler(value.id)}>{value.cat_name}</div>
                    )
                })}
                <a href={"/categories"}><div className="cat">Все категории ({data.length})</div></a>
            </div>
        </div>
    )
}
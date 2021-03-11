import React, { useEffect, useState } from "react";
import Header from "../header";
import { useHttp } from "../hooks/http.hook";
import { Link, useParams } from "react-router-dom";
import { saveActivityCard } from "../../action/action-login";
import { connect } from "react-redux";
import Loading from "../loading/loading";

const CardPage = ({ token, saveActivityCard, card }) => {
  const { request } = useHttp();
  let { name } = useParams();

  const [loading, setLoading] = useState(true);

  const getDataCards = async () => {
    try {
      const value = await request(
        "/api/getCard",
        "POST",
        { card_id: name },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      saveActivityCard(value.filterCard[0]);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getDataCards();
  }, [name]);

  if (loading) {
    return <Loading />;
  }

  const { name_Board, color, cards } = card;

  const label = cards.map((e) => {
    return (
      <div className="card-item">
        <p>{e.card_name}</p>
        <p> + добавить карточку</p>
      </div>
    );
  });

  return (
    <div className={`${color} card-page`}>
      <Header color={color} />
      <div> Название доски: {name_Board}</div>
      <div className="card-body">
        {label}
        <div className="card-add">
          <p>+ Добавить еще одну колонку</p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: { card },
  loginReducer: { token },
}) => {
  return { token, card };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveActivityCard: (card) => {
      dispatch(saveActivityCard(card));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardPage);

import React, { useState, useCallback } from 'react'
import Card from './DraggableCard'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import isBuyer from './isBuyer';
import loginCheck from './LoginCheck'

const style = {
  display: "flex",
  flexDirection: "row",
  width: "min-content"
}

const Container = (props) => {
  {
    const [cards, setCards] = useState(props.upcomingOrders.map(e => { e.id = e._id; return e }));
    const moveCard = useCallback(
      (dragIndex, hoverIndex) => {
        const dragCard = cards[dragIndex]
        setCards(
          update(cards, {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
          }),
        )
      },
      [cards],
    )
    const renderCard = (card, index) => {
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          text={card}
          moveCard={moveCard}
        />
      )
    }
    return (
      <>
        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  const { upcomingOrders } = state.app;
  return { upcomingOrders };
}
export default connect(mapStateToProps)(loginCheck(isBuyer(Container)));

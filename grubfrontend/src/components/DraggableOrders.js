import React, { useState, useCallback } from 'react'
import update from 'immutability-helper';
import OrderCard from './OrderCard';
import DraggableCard from './DraggableCard';
const style = {
  width: 400,
}
const Container = () => {
  {
    const [cards, setCards] = useState([
      {
        id: 1,
        details : {
            displayPic : "",
            restName : "1",
            amt : 5.00
        }

      },
      {
        id: 2,
        details : {
            displayPic : "",
            restName : "2",
            amt : 5.00
        }
      },
      {
        id: 3,
        details : {
            displayPic : "",
            restName : "3",
            amt : 5.00
        }
      },
      {
        id: 4,
        details : {
            displayPic : "",
            restName : "4",
            amt : 5.00
        }
      }
    ])
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
        // <Card
        //   key={card.id}
        //   index={index}
        //   id={card.id}
        //   text={card.text}
        // />
        <DraggableCard details={card.details} index={index} key={card.id}
        moveCard={moveCard} ></DraggableCard>
      )
    }
    return (
      <>
        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    )
  }
}
export default Container

import { useState, useEffect } from "react";
import Number from "../number/Number";
import fieldOne from "../../data/fieldOne";
import fieldTwo from "../../data/fieldTwo"; 
import wand from "../../images/magic-wand.svg";
import "./Ticket.scss";

const Ticket = () => {
    const [selectedOne, setSelectedOne] = useState([]);
    const [selectedTwo, setSelectedTwo] = useState([]);
    const [isTicketWon, setIsTicketWon] = useState(false);
    const [randomNumbers, setRandomNumbers] = useState({ randomOne: [], randomTwo: [] });

    const firstField = [];
    const secondField = []; 

    useEffect(()=> {
        const randOne = new Set();
        const randTwo = Math.floor(Math.random() * 2) + 1; 

        while (randOne.size !== 8) {
            randOne.add(Math.floor(Math.random() * 19) + 1);
        }
        setRandomNumbers({ randomOne: [...randOne].sort((a, b) => a - b), randomTwo: [randTwo] });
    }, []);

    const showResult = () => {
        if (selectedOne.length < 8 || selectedTwo.length !== 1) {
            alert("Отметьте все числа"); 
        } else {
            for (let i = 0; i < selectedOne.length; i++) { 
                firstField.push(selectedOne[i].number); 
                firstField.sort((a, b) => a - b);
            }

            for (let i = 0; i < selectedTwo.length; i++) {
                secondField.push(selectedTwo[i].number);
            }
        }

        const intersectionFieldOne = firstField.filter(num => randomNumbers.randomOne.includes(num));
        const intersectionFieldTwo = secondField.filter(num => randomNumbers.randomOne.includes(num));

        if (intersectionFieldOne.length >= 4 || (intersectionFieldOne.length >= 3 && intersectionFieldTwo > 0)) {
            setIsTicketWon(true); 
        } else {
            alert("Обновите страницу и попробуйте еще раз");
        }

        const data = {
            selectedNumber: {
                firstField: firstField,
                secondField: secondField
            },
            isTicketWon: isTicketWon
        }
    
        const dataJSON = JSON.stringify(data);

        handleUpload("https://jsonplaceholder.typicode.com/posts", dataJSON); 
    }

    const handleUpload = async (url, data) => {
        const response = await fetch(url, {
            method: "POST",
            body: data,
        });

        if (response.status === 200) {
            return response.json;
        } else {
            uploadRetry("https://jsonplaceholder.typicode.com/posts", data, 2000, 2); 
        }
    }
    
    const uploadRetry = (url, data, delay, tries) => {
        const response = fetch(url, {
            method: "POST",
            body: data,
        });

        const onError = () => {
            const triesLeft = tries - 1;
            
            if (!triesLeft) {
                console.log(`Ошибка`);
            }

            const wait = (delay) => {
                return new Promise((resolve) => setTimeout(resolve, delay));
            }
    
            return wait(delay).then(() => uploadRetry(url, delay, triesLeft, data));
        }

        try {
            return response.json;
        } catch {
            return onError(); 
        }
    }

    return (
        <div className="ticket">
            <div className="ticket__header">
                <h3 className="ticket__title">Билет 1</h3>
                <img src={wand} className={isTicketWon ? "ticket__icon disabled" : "ticket__icon"} />
            </div>
            {!isTicketWon ?
                <>
                    <div className="ticket__field">
                        <div className="ticket__subtitle">
                            <h4>Поле 1</h4>
                            {selectedOne.length < 1 ?
                                <p>Отметьте 8 чисел</p>
                            : selectedOne.length >= 1 && selectedOne.length < 8 ?
                                <p>Отметьте {8 - selectedOne.length} {(8 - selectedOne.length) === 1 ? "число" : (8 - selectedOne.length) > 1 && (8 - selectedOne.length) <= 4 ? "числа" : "чисел"}</p>
                            : 
                                null
                            }
                        </div>
                        <Number setSelectedOne={setSelectedOne} selectedOne={selectedOne}>
                            {fieldOne}
                        </Number>
                    </div>
                    <div className="ticket__field">
                        <div className="ticket__subtitle">
                            <h4>Поле 2</h4>
                            {selectedTwo < 1 ?
                                <p>Отметьте 1 число</p>
                            :
                                null
                            }
                        </div>
                        <Number setSelectedTwo={setSelectedTwo} selectedTwo={selectedTwo}>
                            {fieldTwo}
                        </Number>
                    </div>
                    <button className="ticket__btn" onClick={showResult}>Показать результат</button>
                </>
            :
                <p>Ого, вы выиграли! Поздравляем!</p>
            }
        </div>
    );
}

export default Ticket; 

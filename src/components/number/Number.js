import "./Number.scss";

const Number = ({ children, setSelectedOne, selectedOne, setSelectedTwo, selectedTwo }) => {

    const onNumberClick = (currentNumber) => {
        if (currentNumber.type === "fieldOne" && !selectedOne.includes(currentNumber) && currentNumber.clicked === false && selectedOne.length < 8) {
            currentNumber.clicked = true; 
            setSelectedOne([...selectedOne, currentNumber]);
        } else if(currentNumber.type === "fieldTwo" && !selectedTwo.includes(currentNumber) && currentNumber.clicked === false && selectedTwo.length < 1) {
            currentNumber.clicked = true; 
            setSelectedTwo([...selectedTwo, currentNumber]);
        } else if (currentNumber.type === "fieldOne" && currentNumber.clicked) {
            currentNumber.clicked = false; 
            setSelectedOne(selectedOne.filter(num => num.clicked !== false));
        } else if (currentNumber.type === "fieldTwo" && currentNumber.clicked) {
            currentNumber.clicked = false; 
            setSelectedTwo(selectedTwo.filter(num => num.clicked !== false));
        } 
    }

    return (
        <div className="number">
            {children?.map(item => 
                item.clicked ? 
                    <p onClick={() => onNumberClick(item)} className="number__item clicked" key={item.id}>
                        {item.number}
                    </p>
                :
                    <p onClick={() => onNumberClick(item)} className="number__item" key={item.id}>
                        {item.number}
                    </p>
            )}
        </div>
    );
}

export default Number; 

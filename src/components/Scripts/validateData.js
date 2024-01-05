function validateData(data,validateDataorArray,cantCar = 0){
    switch (validateDataorArray) {
        case 1:
            if(data.length >= cantCar){
                return true
            }
            else {
                return false
            }
        case 2:
            let newArrayValidator = []
            for (let index = 0; index < data.length; index++) {
                if (data[index] !== "" && data[index] !==0 && data[index] !== null && data[index] !== undefined) {
                    newArrayValidator.push(data[index])
                }
            }
            if (newArrayValidator.length === data.length) {
                return true;
            }else {
                return false;
            }
        default:
            break;
    }
}

export default validateData
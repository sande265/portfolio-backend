import { capitalString, ucFirst } from "./general.helper";

/**
 * Function to validate incoming data.
 * @param data Pass an object of data to validate;
 * @param validationRule rule by which data is validated
 * @param error error instance
 * @param localvalidationerror boolean to return true if an error is present
 * @returns 
 */
export const localValidation = (data: DataObj, validationRule: ValidationRuleOptions, error: DataObj = {}, localvalidationerror: boolean = false) => {
    if (validationRule) {
        Object.keys(validationRule).forEach((item: string) => {
            for (let i = 0; i < validationRule[item]?.length; i++) {
                let validate = validation(item, data[item], validationRule[item][i], data);                
                if (validate) {                    
                    error[item] = validate;
                    localvalidationerror = true;
                    break;
                }
            }
        })
    }
    return {
        localvalidationerror,
        error
    }

    /**
     * 
     * @param name Name of the validatee
     * @param value value to the validatee being validated
     * @param rule rule being implied to check the value
     * @param data data set
     * @returns Object Containing errors.
     */
    function validation(name: string, value: any, rule: any, data: DataObj): any {        

        const r = rule;

        if (typeof rule === "object") {
            let { param, values } = rule;
            switch (param) {
                case "in":
                    return !values.includes(value) ? [capitalString(name) + " is invalid. avaiable options: " + values.join(", ")] : null;
                default:
                    return null;
            }
        }

        switch (rule) {

            case "required": {
                return value || value === "0" ? null : [capitalString(name) + " field is required."]
            }
            case "email": {
                let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(value) ? null : [capitalString(name) + " is not a valid email."]
            }
            case "password": {
                return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value) ? null : 
                [capitalString(name) + ` must contain one special charecter (@#$&*!), one number (0-9) & one upper case letter.`]
            }
            case "numeric": {
                return typeof value === "number" ? null : [capitalString(name) + " field must be of type number."]
            }
            case "array": {
                return Array.isArray(value) ? null : [capitalString(name) + " field must be array."]
            }
            case "date": {
                return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value) ? null : [capitalString(name) + " date format is invalid, i.e format: YYYY-MM-DD."]
            }
            case "min": {
                if (typeof value === "string") {
                    return value.length < r[1] ? [capitalString(name) + " must be minimum of " + r[1] + " character."] : null
                } else if (typeof value === "number") {
                    return value < r[1] ? [ucFirst(name) + " must be greater than or equals " + r[1] + " ."] : null
                } else if (Array.isArray(value)) {
                    return value.length < r[1] ? [capitalString(name) + " must contain minimum of " + r[1] + " item."] : null
                }
                return null
            }
            case "greater_than": {
                if (value > data[r[1]])
                    return null
                else
                    return [capitalString(name) + " must be greater than " + r[1] + " ."]
            }
            case "max": {
                if (typeof value === "string") {
                    return value.length > r[1] ? [capitalString(name) + " must be maximum of " + r[1] + " character."] : null
                } else if (typeof value === "number") {
                    return value > r[1] ? [capitalString(name) + " must be less than or equals " + r[1] + " ."] : null
                } else if (Array.isArray(value)) {
                    return value.length > r[1] ? [capitalString(name) + " must contain maximum of " + r[1] + " item."] : null
                }
                return null
            }
            case "in": {
                let lists = r[1].split(",");
                console.log("lists", r);
                if (lists.includes(value)) {
                    return null
                } else {
                    return [capitalString(name) + " is invalid."]
                }
            }
            case "mac": {
                let re = /^([a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2})$/
                return re.test(value) ? null : [capitalString(name) + " is not valid. Must be hexadecimal number of format XX:XX:XX:XX:XX:XX"]

            }
            case "presentElement": {
                return value.length > 0 ? null : [capitalString(name) + " is required."]
            }
            case "unique": {
                let index = data[r[1]].indexOf(value);
                return index < 0 ? null : [capitalString(name) + " already esists."]
            }
            case "url": {
                let re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
                if (value) {
                    return re.test(value) ? null : [capitalString(name) + " is not a valid Url."]
                }
                return null
            }
            case "image_dimensions": {
                let dmsn = r[1].split("=")
                dmsn[0] = dmsn[0].trim().toLowerCase()
                switch (dmsn[0]) {
                    case "fixed": {
                        let vals = dmsn[1].split(",");
                        return ((parseInt(vals[0]) === parseInt(vals[2])) && (parseInt(vals[1]) === parseInt(vals[3]))) ? null :
                            ["Image height, width must be " + vals[0] + ", " + vals[1] + " ."]
                    }
                    case "min": {
                        let vals = dmsn[1].split(",");
                        return ((parseInt(vals[0]) <= parseInt(vals[2])) && (parseInt(vals[1]) <= parseInt(vals[3]))) ? null :
                            ["Image height, width must be mimimum of " + vals[0] + ", " + vals[1] + " ."]
                    }
                    case "max": {
                        let vals = dmsn[1].split(",");
                        return (parseInt(vals[0]) >= parseInt(vals[2]) && parseInt(vals[1]) >= parseInt(vals[3])) ? null :
                            ["Image height, width must be maximum of " + vals[0] + ", " + vals[1] + " ."]
                    }
                    default:
                }
            }
            case "*": {

            }
                break
            default:
                return null
        }
    }
}


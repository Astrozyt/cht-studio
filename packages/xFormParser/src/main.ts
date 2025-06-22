import './style.css'
import { mockXML } from './mockXML';
import { parseXFormDoc } from '.';

const main = async () => {

    const parser = new DOMParser();
    const doc = parser.parseFromString(mockXML, 'application/xml');
    const result = parseXFormDoc([doc]);
    const resultTextArea = document.createElement('textarea');
    resultTextArea.value = JSON.stringify(result, null, 2);
    resultTextArea.style.width = '100%';
    resultTextArea.style.height = '100vh';
    document.body.appendChild(resultTextArea);
};

main().catch(err => {
    console.error("Error in main: ", err);
});

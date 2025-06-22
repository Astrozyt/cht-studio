// packages/xFormParser/dev.ts
import { parseXFormDoc } from './index';
import { mockXML } from './mockXML';

const doc = new DOMParser().parseFromString(mockXML, 'text/xml');
const result = parseXFormDoc([doc]);
console.log(JSON.stringify(result, null, 2));

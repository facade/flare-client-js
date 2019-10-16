import FlareClient from './FlareClient';
import catchWindowErrors from './util/browserClient';

export default new FlareClient();

catchWindowErrors();

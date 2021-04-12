import { message } from '../types/messages/message.types';

const getMessage = (message: message, object?: object): string => {
  if (typeof message !== 'object') return message;

  let replacedMessage: string = message.msg;

  message.replace.forEach((replace) => {
    replace.to = replace.to.replace(/\{(.+)\}/, '$1');
    const regex = new RegExp(`\\{${replace.from}\\}`, 'g');
    replacedMessage = replacedMessage.replace(regex, object[replace.to]);
  });

  return replacedMessage;
};

export { getMessage };

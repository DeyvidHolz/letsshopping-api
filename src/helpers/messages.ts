import { message } from '../types/messages/message.types';

export default function (message: message, object?: object): string {
  if (typeof message !== 'object') return message;

  let replacedMessage: string = message.msg;

  message.replace.forEach((replace) => {
    replace.to = replace.to.replace(/\{(.+)\}/, '$1');
    const regex = new RegExp(`\\{${replace.to}\\}`, 'g');
    replacedMessage = replacedMessage.replace(regex, object[replace.from]);
  });

  return replacedMessage;
}

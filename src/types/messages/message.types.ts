type Message =
  | string
  | { msg: string; replace?: { from: string; to: string }[] };

type Messages = {
  [key: string]: Message;
};

export { Message, Messages };

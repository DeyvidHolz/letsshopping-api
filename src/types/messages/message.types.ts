type Message =
  | string
  | { msg: string; replace?: { from: string; to: string }[] | string[] };

type Messages = {
  [key: string]: Message;
};

export { Message, Messages };

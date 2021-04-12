type message =
  | string
  | { msg: string; replace?: { from: string; to: string }[] };

type messages = {
  [key: string]: message;
};

export { message, messages };

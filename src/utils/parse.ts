import htmlReactParser from "html-react-parser";

const parse = (text: string, args?: Parameters<typeof htmlReactParser>[1]) => {
  return htmlReactParser(text.replaceAll("\n", "<br>"), args);
};

export default parse;

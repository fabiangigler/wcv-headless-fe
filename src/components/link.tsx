import NextLink from "next/link";
import { ComponentProps } from "react";
import styles from "./link.module.scss";
import cx from "@/utils/cx";

interface Link extends ComponentProps<typeof NextLink> {}

const Link = (props: Link) => {
  const { className, ...rest } = props;
  return <NextLink className={cx(styles.root, className)} {...rest} />;
};
export default Link;

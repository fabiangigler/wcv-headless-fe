export const formatUriArray = (uri: string[]) => {
  return "/" + (uri?.join("/") ?? "");
};

export const getDisplayName = (component: any) => {
  return component?.displayName || component?.name || "Component";
};

import styled, {css} from "styled-components/native";
import {theme} from "./utils";

export const Center = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const flexCenter = css`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const TonicButton = css`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.colors.foreground};
`;

export const TonicButtonWhite = css`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.colors.white};
`;

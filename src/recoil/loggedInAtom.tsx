import {atom} from 'recoil';

export const loggedInAtom = atom<boolean>({
  key: 'loggedIn',
  default: false,
});

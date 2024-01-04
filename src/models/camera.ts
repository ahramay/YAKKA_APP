export type photo = {
  photoB64?: string;
  photo?: string;
} & (
  | {
      id: number;
      facebook: true;
    }
  | {
      facebook?: false;
    }
);

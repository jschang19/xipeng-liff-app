interface Profile {
  userId: string;
  displayName: string;
  pictureUrl: string;
  email: string | null;
  type: {
    staff: boolean;
    speaker: boolean;
  };
}

interface Event {
  id: string;
  title: string;
  type: "training" | "game";
  isOpen: boolean;
  repeatDay: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  createdBy: Profile;
  createdAt: string;
  startAt: string;
  scope: 0 | 1;
  place: string | null;
  endAt: string;
}

interface Stamp {
  id: string;
  type: "speaker" | "booth" | "empty";
  booth: {
    name: string;
    description: string;
    imageUrl: string;
    link: string;
  };
}

interface FullProfile extends Profile {
  uuid: string;
}

export { Profile, FullProfile, Event, Stamp };

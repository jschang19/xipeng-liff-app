interface Profile {
  userId: string;
  uuid?: string;
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
  place: string;
  startAt: number;
  endAt: number;
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

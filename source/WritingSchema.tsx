import Realm, { BSON } from 'realm';

export class Writing extends Realm.Object {
  _id!: BSON.ObjectId;
  username!: string;
  subject!: string;
  title!: string;
  sample!: string;
  beginday?: Date;
  modday?: Date;

  static schema: Realm.ObjectSchema = {
    name: 'writing',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      username: 'string',
      subject: 'string',
      title: "string",
      sample: "string",
      beginday: 'date?',
      modday: 'date?',
    },
  };
}
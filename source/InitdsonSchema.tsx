import Realm, { BSON } from 'realm';
// import { initdson_allsub } from './initdson_allsubSchema';

export class Initdson extends Realm.Object {
  _id!: BSON.ObjectId;
  // _class?: string;
  username!: string;
  chname!: string;
  allsub!: string;
  // allsub!: initdson_allsub[];
  beginday?: Date;
  modday?: Date;

  static schema: Realm.ObjectSchema = {
    name: 'initdson',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      // _class: 'string',
      username: 'string',
      chname: 'string',
      allsub: "string",
      beginday: 'date?',
      modday: 'date?',
    },
  };
}
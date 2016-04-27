import * as mongoose from 'mongoose';

export default class TestUtils {
  static clearCollection(collection: any) {
    return new Promise<{}>((resolve) => {
      console.log('clear collection: ' + collection.collectionName);
      collection.remove(resolve);
    });
  }

  static clearDb(): Promise<{}> {
    let promises: Promise<{}>[] = [];
    for (let i in mongoose.connection.collections) {
      let c = mongoose.connection.collections[i] as any;
      promises.push(TestUtils.clearCollection(c));
    }
    return Promise.all(promises).then(() => {
      console.log('mongodb all cleard');
      return Promise.resolve();
    });
  }

  static reset(config: { db: { test: string; }; }) {
    return new Promise<{}>((resolve, reject) => {
      if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.db.test, function(err: any) {
          if (err) {
            throw err;
          }
          TestUtils.clearDb().then(resolve);
        });
      } else {
        TestUtils.clearDb().then(resolve);
      }
    });
  }

}

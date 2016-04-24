import PublicConfig from '../PublicConfig';

var gcloud = require('gcloud');

let storage = gcloud.storage(PublicConfig.gcloudConfig);
let bucket = storage.bucket(PublicConfig.storage.bucket);

export default class Storage {
  static put(name: string, data: any): Promise<{}> {
    return new Promise<{}>((resolve, reject) => {
      let file = bucket.file(name);
      file.save(JSON.stringify(data), (err: any) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  static get(name: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let file = bucket.file(name);
      file.download((err: any, contents: string) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(contents));
      });
    });
  }
}

import * as zlib from 'zlib';

export default class Zip {
  public static deflate(source: string): Promise<string> {
    return new Promise((resolve, reject) => {
      zlib.deflate(source, (err, buffer) => {
        if (err) { return reject(err); }
        resolve(buffer.toString('base64'));
      });
    });
  }
  public static unzip(encoded: string): Promise<string> {
    return new Promise((resolve, reject) => {
      zlib.unzip(Buffer.from(encoded, 'base64'), (err, buffer) => {
        if (err) { return reject(err); }
        resolve(buffer.toString());
      });
    });
  }
}

export default class Command {
  isAccepted = false;
  validate() {
    if (!this.isAccepted) {
      throw new Error("Invalid command. ");
    }
  }
  accept() {
    this.isAccepted = true;
  }
  unaccept() {
    this.isAccepted = false;
  }
}

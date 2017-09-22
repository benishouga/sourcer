export default class Command {
  private isAccepted = false;
  public validate() {
    if (!this.isAccepted) {
      throw new Error('Invalid command.');
    }
  }
  public accept() {
    this.isAccepted = true;
  }
  public unaccept() {
    this.isAccepted = false;
  }
}

import Utils from './core/Utils';
import V from './core/V';
import * as $ from 'jquery';

class Test2d {
  public context: CanvasRenderingContext2D;
  public width: number;
  public height: number;

  constructor(canvas: HTMLCanvasElement, public target: (v: V) => boolean) {
    this.context = <CanvasRenderingContext2D>canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  public draw() {
    this.context.fillStyle = '#eee';
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.save();
    this.context.translate(0.5, 0.5);
    this.drawBackground();
    this.test();
    this.context.restore();
  }

  private test() {
    var halfX = this.width / 2;
    var halfY = this.height / 2;
    for (var x = -halfX; x <= halfX; x += 2.5) {
      for (var y = -halfY; y <= halfY; y += 2.5) {
        this.dot(x, y, this.target(new V(x, y)));
      }
    }
  }

  private drawBackground() {
    var halfX = this.width / 2;
    for (var x = 0; x <= halfX; x += 10) {
      this.line(x, halfX, x, -halfX);
      this.line(-x, halfX, -x, -halfX);
    }
    var halfY = this.height / 2;
    for (var y = 0; y <= halfY; y += 10) {
      this.line(halfY, y, -halfY, y);
      this.line(halfY, -y, -halfY, -y);
    }

    this.line(0, halfX, 0, -halfX, '#0f0');
    this.line(halfY, 0, -halfY, 0, '#0f0');
  }

  private dot(x: number, y: number, result: boolean) {
    var [x, y] = this.coord(x, y);

    this.context.fillStyle = result ? 'rgb(0, 0, 255)' : 'rgb(255, 0, 0)';
    this.context.beginPath();
    this.context.arc(x, y, 1, 0, Math.PI * 2);
    this.context.fill();
  }

  private line(fromX: number, fromY: number, toX: number, toY: number, color?: string) {
    [fromX, fromY] = this.coord(fromX, fromY);
    [toX, toY] = this.coord(toX, toY);

    this.context.lineWidth = 1;
    this.context.strokeStyle = color || '#dddddd';
    this.context.beginPath()
    this.context.moveTo(fromX, fromY);
    this.context.lineTo(toX, toY);
    this.context.stroke();
  }

  public coord(x: number, y: number) {
    return [x + this.width / 2, -y + this.height / 2];
  }
}

$(() => {
  $("canvas.side").each(function() {
    var element = $(this);
    var side = Utils.side(
      new V(parseInt(element.attr('data-x')), parseInt(element.attr('data-y'))),
      parseInt(element.attr('data-angle')));
    new Test2d(this, side).draw();
  });
  $("canvas.radar").each(function() {
    var element = $(this);
    var radar = Utils.createRadar(
      new V(parseInt(element.attr('data-x')), parseInt(element.attr('data-y'))),
      parseInt(element.attr('data-direction')),
      parseInt(element.attr('data-angle')),
      parseInt(element.attr('data-renge'))
      );
    new Test2d(this, radar).draw();
  });
});

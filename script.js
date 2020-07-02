const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

let player = 0;
const winningPossibilities = [
  "123",
  "456",
  "789",
  "147",
  "258",
  "369",
  "159",
  "357",
];

const handleClick = (e) => {
  let x = e.clientX - cvs.offsetLeft;
  let y = e.clientY - cvs.offsetTop;

  if (state.status && !state.isTaken(x, y)) {
    if (x >= 0 && x <= cvs.width && y >= 0 && y <= cvs.height) {
      player = !player ? 1 : 0;
      state.setState(x, y, player);
      requestAnimationFrame(draw);
    }
  }
};

document.addEventListener("click", handleClick);

const dim_block = cvs.width / 3;

const getPositions = () => {
  let positions = [];
  let rowStart = 0;

  for (let i = 0; i < 3; i++) {
    let colStart = 0;
    let tempList = [];

    for (let j = 0; j < 3; j++) {
      let obj = {
        x: colStart,
        y: rowStart,
      };

      colStart += dim_block;
      tempList.push(obj);
    }
    positions.push(tempList);
    rowStart += dim_block;
  }
  return positions;
};

const grid = {
  positions: getPositions(),
  draw: function () {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000";
    ctx.rect(0, 0, cvs.width, cvs.height);

    ctx.moveTo(this.positions[0][1].x, this.positions[0][1].y);
    ctx.lineTo(this.positions[2][1].x, this.positions[2][1].y + dim_block);

    ctx.moveTo(this.positions[0][2].x, this.positions[0][2].y);
    ctx.lineTo(this.positions[2][2].x, this.positions[2][2].y + dim_block);

    ctx.moveTo(this.positions[1][0].x, this.positions[1][0].y);
    ctx.lineTo(this.positions[1][2].x + dim_block, this.positions[1][2].y);

    ctx.moveTo(this.positions[2][0].x, this.positions[2][0].y);
    ctx.lineTo(this.positions[2][2].x + dim_block, this.positions[2][2].y);
    ctx.stroke();
  },
};

const state = {
  status: 1,
  values: [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ],
  draw: function () {
    this.values.forEach((row, i) => {
      row.forEach((val, j) => {
        if (val !== -1) {
          ctx.drawImage(
            val === 0 ? asset_O : asset_X,
            grid.positions[i][j].x,
            grid.positions[i][j].y
          );
        }
      });
    });
  },

  isTaken: function (x, y) {
    let pos = this.pointerToGrid(x, y);
    return this.values[pos.y][pos.x] !== -1;
  },

  pointerToGrid: function (x, y) {
    let pos = {};
    if (x < grid.positions[0][1].x) pos.x = 0;
    else if (x < grid.positions[0][2].x) pos.x = 1;
    else pos.x = 2;

    if (y < grid.positions[1][0].y) pos.y = 0;
    else if (y < grid.positions[2][0].y) pos.y = 1;
    else pos.y = 2;

    return pos;
  },

  setState: function (x, y, player) {
    let pos = this.pointerToGrid(x, y);

    if (this.values[pos.y][pos.x] === -1) this.values[pos.y][pos.x] = player;
    this.check(player);
  },

  numberToValue: function (n) {
    let pos = {};
    if (n <= 3) {
      pos.x = 0;
      pos.y = n - 1;
    } else if (n <= 6) {
      pos.x = 1;
      pos.y = n - 4;
    } else if (n <= 9) {
      pos.x = 2;
      pos.y = n - 7;
    }
    return this.values[pos.x][pos.y];
  },

  check: function (player) {
    winningPossibilities.forEach((val) => {
      let row = [];
      for (let i = 0; i < 3; i++) row.push(this.numberToValue(val[i]));

      if (row[0] !== -1 && row[0] === row[1] && row[1] === row[2]) {
        console.log(`${player ? "X" : "O"} Wins`);
        this.draw();
        this.status = 0;

        document.getElementById("winner").innerHTML = `${
          player ? "X" : "O"
        } WON!`;
      }

      let isTie = true;
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) if (this.values[i][j] === -1) isTie = false;

      if (isTie) {
        this.draw();
        document.getElementById("winner").innerHTML = `It's a TIE!`;
        this.status = 0;
      }
    });
  },
};

const asset_X = new Image();
asset_X.src = "assets/X.png";

const asset_O = new Image();
asset_O.src = "assets/O.png";

const draw = () => {
  grid.draw();
  state.draw();
};

asset_X.onload = () => {
  draw();
};

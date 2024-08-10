let mainDiv = document.getElementById('main-div');
        let traverseBtn = document.getElementById('traverse-btn');
        let regenerateBtn = document.getElementById('regenerate-btn');
        let id = 0;
        const gridSize = 10;
        let obstacles = [[1, 1], [2, 2], [2, 4], [4, 5], [6, 7], [9, 4], [8, 9], [0, 9], [6, 8], [6, 9]];
        let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));

        const generateObstacles = () => {
            obstacles = [];
            for (let i = 0; i < 10; i++) {
                let randX = Math.floor(Math.random() * gridSize);
                let randY = Math.floor(Math.random() * gridSize);
                if ((randX !== 0 || randY !== 0) && (randX !== gridSize - 1 || randY !== gridSize - 1)) {
                    obstacles.push([randX, randY]);
                }
            }
        };

        const updateGrid = () => {
            grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
            for (let [I, J] of obstacles) {
                grid[I][J] = -1;
            }
        };

        const updateGridUI = (currentX, currentY, previousX, previousY) => {
            if (previousX !== undefined && previousY !== undefined) {
                const prevDiv = document.getElementById(`${previousX * gridSize + previousY}`);
                prevDiv.classList.remove('bg-blue-500');
                prevDiv.classList.add('bg-green-500', 'animate-traverse'); 
            }
            
            const currDiv = document.getElementById(`${currentX * gridSize + currentY}`);
            currDiv.classList.add('bg-blue-500', 'animate-traverse');
        }

        const traverse = async (x, y, prevX, prevY) => {
            if (x === gridSize - 1 && y === gridSize - 1) {
                console.log("Reached destination!");
                updateGridUI(x, y, prevX, prevY);
                return true;
            }

            if (x < 0 || y < 0 || x >= gridSize || y >= gridSize || grid[x][y] !== 0) {
                return false;
            }

            grid[x][y] = 1;
            updateGridUI(x, y, prevX, prevY);
            await new Promise(resolve => setTimeout(resolve, 300));

            if (await traverse(x, y + 1, x, y)) return true;
            if (await traverse(x + 1, y, x, y)) return true;
            if (await traverse(x, y - 1, x, y)) return true; 
            if (await traverse(x - 1, y, x, y)) return true; 

            grid[x][y] = 0;
            return false;
        };

        const generateGrid = () => {
            mainDiv.innerHTML = '';
            id = 0;
            updateGrid();

            for (let i = 0; i < gridSize; i++) {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'flex justify-between';
                
                for (let j = 0; j < gridSize; j++) {
                    const childDiv = document.createElement('div');
                    childDiv.id = `${id}`;
                    childDiv.className = 'w-12 h-12 p-0 m-1 flex items-center justify-center border text-white font-bold cursor-pointer animate-traverse';
                    
                    if (i === 0 && j === 0) {
                        childDiv.innerHTML = 'S';
                        childDiv.classList.add('bg-blue-500'); 
                    } else if (i === gridSize - 1 && j === gridSize - 1) {
                        childDiv.innerHTML = 'D';
                        childDiv.classList.add('bg-red-500');
                    } else if (grid[i][j] === -1) {
                        childDiv.innerHTML = 'x';
                        childDiv.classList.add('bg-gray-700');
                    } else {
                        childDiv.innerHTML = '';
                    }
            
                    rowDiv.appendChild(childDiv);
                    id++;
                }
                mainDiv.appendChild(rowDiv);
            }
        }

        generateGrid();

        traverseBtn.addEventListener('click', () => {
            traverse(0, 0);
        });

        regenerateBtn.addEventListener('click', () => {
            generateObstacles();
            generateGrid();
        });
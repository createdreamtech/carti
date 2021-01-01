-- Load the Cartesi module
local cartesi = require"cartesi"
-- Instantiate machine from configuration
local machine = cartesi.machine(require(arg[1]))
-- Run machine until it halts
while not machine:read_iflags_H() do
    machine:run(math.maxinteger)
end
machine:store("cartesi-machine")
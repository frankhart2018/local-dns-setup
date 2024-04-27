check_command_installed() {
    OUTPUT=$(which $1)
	if [ -z "$OUTPUT" ]; then
		echo "Please install $2, use 'sudo apt install $2 -y'"
        return 1
	fi

    return 0
}

make_fifo_if_not_exists() {
	if [ ! -p "$1" ]; then
		mkfifo "$1"
	fi
}

TOTAL=0
check_command_installed "ifconfig" "net-tools"
TOTAL=$((TOTAL + $?))
check_command_installed "docker" "docker.io"
TOTAL=$((TOTAL + $?))
check_command_installed "docker-compose" "docker-compose"
TOTAL=$((TOTAL + $?))
if [ $TOTAL -gt 0 ]; then
	echo "Some errors exist"
	return 1
fi

PIPE_COMM_DIR=$HOME/pipe-comm
PIPE_PATH=$HOME/command-runner
DNS_CONFIG_PATH=$HOME/dns-config
IP=`python3 get_ip.py`

mkdir -p $PIPE_COMM_DIR
mkdir -p $DNS_CONFIG_PATH
make_fifo_if_not_exists $PIPE_PATH
python3 execute_pipe.py --pipe-path $PIPE_PATH --pipe-output-dir $PIPE_COMM_DIR &

sudo IP=$IP PIPE_COMM_DIR=$PIPE_COMM_DIR PIPE_PATH=$PIPE_PATH DNS_CONFIG_DIR=$DNS_CONFIG_PATH docker-compose up -d

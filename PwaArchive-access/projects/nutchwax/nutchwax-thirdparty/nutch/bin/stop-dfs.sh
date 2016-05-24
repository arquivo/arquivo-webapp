#!/bin/sh

# Stop hadoop DFS daemons.  Run this on master node.

bin=`dirname "$0"`
bin=`cd "$bin"; pwd`

. "$bin"/hadoop-config.sh

"$bin"/hadoop-daemon.sh --config $HADOOP_CONF_DIR stop namenode
"$bin"/hadoop-daemons.sh --config $HADOOP_CONF_DIR stop datanode
"$bin"/hadoop-daemons.sh --config $HADOOP_CONF_DIR --hosts masters stop secondarynamenode


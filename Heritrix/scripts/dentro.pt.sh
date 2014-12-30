#!/bin/sh

#verifies number of arguments
if [ $# -ne 1 ]; then
echo Usage: $0 SEEDS
exit 127
fi

SEEDS=$1

#Para sacar endere�os s� com o dom�nio com e sem barra final, removendo a barra final � sa�da, dentro de .PT, sem os blogs do sapo:
cat $SEEDS | sed 's/ //g' | egrep "^http://[^/]+/$|^http://[^/]+$" | sed 's/\/$//g' | egrep  "\.pt$|\.pt/|\.pt:" | egrep -v "\.blogs\.sapo\.pt" | egrep "^http://[^/]+\.pt" > tmp.dentro

#Para sacar endere�os com directorias, dentro de .PT, sem os blogs do sapo:
cat $SEEDS | sed 's/ //g' | egrep -v "^http://[^/]+/$|^http://[^/]+$" |egrep "\.pt$|\.pt/|\.pt:" | egrep -v "\.blogs\.sapo\.pt" | egrep "^http://[^/]+\.pt" >> tmp.dentro

cat tmp.dentro | sort -u

rm -rf tmp.dentro


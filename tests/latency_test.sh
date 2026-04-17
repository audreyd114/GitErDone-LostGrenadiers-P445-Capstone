#!/usr/bin/env bash

URL="https://www.lostgrenadiers.org/api/get-full-route?lat=38.34509&lon=-85.81937&room=PS-330&accessible=false"
REQUESTS=50

total=0
worst=0

echo "Running $REQUESTS tests..."

for i in $(seq 1 $REQUESTS); do
    t=$(curl -s -o /dev/null -w "%{time_total}" "$URL")

    echo "Request $i: ${t}s"

    total=$(echo "$total + $t" | bc -l)

    comp=$(echo "$t > $worst" | bc)
    if [ "$comp" -eq 1 ]; then
        worst=$t
    fi
done

avg=$(echo "$total / $REQUESTS" | bc -l)

echo
echo "Observed Routing Response Time"
echo "Average: < ${avg}s"
echo "Worst case tested: < ${worst}s"

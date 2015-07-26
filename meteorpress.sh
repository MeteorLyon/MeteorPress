#!/bin/sh - 
#===============================================================================
#
#          FILE: meteorpress.sh
# 
#         USAGE: ./meteorpress.sh 
# 
#   DESCRIPTION: 
# 
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: @iDoMeteor@Gmail
#  ORGANIZATION: 
#       CREATED: 04/29/2015 13:22
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error


#pass parameters as normal
#but remove release if passed
meteor --release 1.1.0.2

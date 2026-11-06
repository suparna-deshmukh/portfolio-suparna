import os, subprocess, sys, time

LOG = open('/tmp/sd-daemon.log', 'ab', buffering=0)
pid = os.fork()
if pid > 0:
    os.waitpid(pid, 0)
    sys.exit(0)
os.setsid()
pid2 = os.fork()
if pid2 > 0:
    sys.exit(0)
os.chdir('/Users/apple/portfolio-suparna')
os.dup2(LOG.fileno(), 1)
os.dup2(LOG.fileno(), 2)
devnull = os.open(os.devnull, os.O_RDONLY)
os.dup2(devnull, 0)
subprocess.run(['npm', 'run', 'dev', '--', '-p', '3210'])

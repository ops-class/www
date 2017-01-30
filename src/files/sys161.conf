# Sample sys161.conf file
#
# This file tells System/161 what devices to use.
#
# There are 32 LAMEbus slots on the System/161 motherboard. There may
# be only one bus controller card, and it must go in slot 31. Other
# than that, you can put in whatever devices you want.
#
# The syntax is simple: one slot per line; the slot number goes first,
# then the expansion card name, then any arguments. Some of the devices
# have required arguments.
#
# The devices are:
#
#   mainboard The multiprocessor LAMEbus controller card. Must go in
#             slot 31, and only in slot 31. Required argument
#             "ramsize=NUMBER" specifies the amount of physical RAM in
#             the system. This amount must be a multiple of the
#             hardware page size (which is probably 4096 or 8192.) The
#             maximum amount of RAM allowed is 16M; this restriction
#             is meant as a sanity check and can be altered by
#             recompiling System/161. The argument "cpus=NUMBER"
#             selects the number of CPUs; the default is 1 and the
#             maximum 32.
#
#   oldmainboard  The uniprocessor LAMEbus controller card, fully
#             backwards compatible with OS/161 1.x. In general,
#             uniprocessor kernels should nonetheless work on the
#             multiprocessor mainboard; therefore this device will
#             probably be removed in the future. Configuration is the
#             same as the multiprocessor mainboard, except that the
#             "cpus" argument is not accepted. The OS/161 1.x name
#             "busctl" is an alias for "oldmainboard".
#
#   trace     The System/161 trace controller device. This can be used
#             by software for various debugging purposes. You can have
#             more than one trace card, but they all manipulate the
#             same internal state. No arguments.
#
#   timer     Countdown timer. The timer card also contains a real-time
#             clock and a small speaker for beeping. Most configurations
#             will include at least one timer. No arguments.
#
#   serial    Serial port. This is connected to the standard input and
#             standard output of the System/161 process, and serves as
#             the system console. Most configurations need this. There
#             is no support at present for more than one serial port.
#             No arguments.
#
#   screen    Full-screen memory-mapped text video card. This is
#             connected to the standard input and standard output of
#             the System/161 process, and serves as the system console.
#             There is no support at present for more than one screen.
#             Likewise, at present you may not use "screen" and "serial"
#             together. No arguments. NOTE: not presently implemented.
#
#   random    (Pseudo-)random number generator. This accesses the
#             randomizer state within System/161; thus, while you can
#             add multiple random cards, they all return values from the
#             same pseudorandom sequence. The random seed is set by
#             using either the "seed=NUMBER" argument, which sets the
#             random seed to a specified value, or the "autoseed"
#             argument, which sets the random seed based on the host
#             system clock. If neither argument is given or no random
#             device is used, the seed is set to 0. Note that the seed
#             affects various randomized behavior of the system as well
#             as the values provided by the random device.
#
#   disk      Fixed disk. The options are as follows:
#                 rpm=NUMBER         Set spin rate of disk.
#                 sectors=NUMBER     Set disk size (legacy; see below).
#                 file=PATH          Specify file to use as storage for disk.
#                 paranoid           Set paranoid mode.
#                 nodoom             Do not invoke the doom counter.
#
#             The "file=PATH" argument must be supplied. The size must be
#             at least 128 sectors (64k), and the RPM setting must be a
#             multiple of 60.
#
#             The "paranoid" argument, if given, causes fsync() to be
#             called on every disk write to make sure the data written
#             reaches actual stable storage. This will make things very
#             slow.
#
#             The "nodoom" argument, if given, inhibits the doom counter
#             for this disk. Otherwise, if the doom counter is enabled
#             using the sys161 -D option, each write decrements the doom
#             counter and the machine switches off when it reaches 0.
#
#             The "sectors" number, if given, sets the size of the disk.
#             (Each sector is 512 bytes.) This option is only provided
#             for compatibility with old configurations. As of System/161
#             1.99.09, the size of the storage image file determines the
#             size of the virtual disk. (One sector is used as a header.)
#             If the configured "sectors" value does not match, a warning
#             is printed. The "sectors" value is only used if the image
#             file does not exist, in which case the file is created with
#             the configured size. This behavior will be removed in a
#             future version - use the disk161 tool to create disk images.
#
#             You can have as many disks as you want (until you run out
#             of slots) but each should have a distinct file to use for
#             storage. Most common setups will use two separate disks,
#             one for filesystem storage and one for swapping.
#
#   nic       Network card. This allows communication among multiple
#             simultaneously-running copies of System/161. The arguments
#             are:
#                 hub=PATH           Give the path to the hub socket.
#                 hwaddr=NUMBER      Specify the hardware-level card address.
#
#             The hub socket path should be the argument supplied to the
#             hub161 program. The default is ".sockets/hub".
#
#             The hardware address should be unique among the systems
#             connected to the same hub. It should be an integer between
#             1 and 65534. Values 0 and 65535 are reserved for special
#             purposes. This argument is required.
#
#             NOTE: disable (comment out) nic devices if you aren't
#             actively using them, to avoid unnecessary overhead.
#
#   emufs     Emulator filesystem. This provides access *within*
#             System/161 to the filesystem that System/161 is running
#             in. There is one optional argument, "dir=PATH". The path
#             specified is used as the root of the filesystem provided
#             by emufs. (Note that it is possible to access the real
#             parent of this root and thus any other directory; this
#             argument does not restrict access.) The default path is
#             ".", meaning System/161's own current directory.
#

0	serial
1	emufs

# You will need to reenable disks before working on ASST3 and ASST4. Here is
# a suggested default configuration: 512k RAM, two disks. The first is marked
# nodoom on the assumption that it will be a swap disk. 5M is probably a good
# default disk size.
#
# Create the disk images with:
#    disk161 create LHD0.img 5M
#    disk161 create LHD1.img 5M
#
#2	disk	rpm=7200	size=5M 	file=LHD0.img   nodoom
#3	disk	rpm=7200	size=5M 	file=LHD1.img

28	random	autoseed
29	timer
30	trace

# This is a good configuration for ASST0-2. You will want to reduce the
# amount of memory during ASST3.

31	mainboard  ramsize=16M  cpus=8

//
//  main.m
//  SnowReports
//
//  Created by Steven Gill on 10-05-11.
//  Copyright Apple Inc 2010. All rights reserved.
//

#import <UIKit/UIKit.h>

int main(int argc, char *argv[]) {
    
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    int retVal = UIApplicationMain(argc, argv, nil, @"SnowReportsAppDelegate");
    [pool release];
    return retVal;
}
